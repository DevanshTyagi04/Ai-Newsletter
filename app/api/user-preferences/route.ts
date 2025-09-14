import { inngest } from "@/lib/inngest/client";
import { createClient } from "@/lib/supabase/server";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";



export async function POST(request: NextRequest){
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if(!user){
        return NextResponse.json(
            {error: "You must be logged in to save prefrences."},
            {status: 401}
        );
    }

    // try {
        const body = await request.json();
        const { categories, frequency, email } = body;

        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            return NextResponse.json(
                { error: "Categories array is required and must not be empty" },
                { status: 400 }
            );
        }

        if (!frequency || !["daily", "weekly", "biweekly"].includes(frequency)) {
            return NextResponse.json(
                { error: "Valid frequency is required (daily, weekly, biweekly)" },
                { status: 400 }
            );
        }

        const {error: upsertError} = await supabase
            .from("user_preferences")
            .upsert(
                { user_id: user.id, categories, frequency, email, is_active: true},
                {onConflict: "user_id"}
            );
            
        if(upsertError) {
            console.error("Error saving preferences:",upsertError);
            return NextResponse.json(
                {error: "Failed to save preferences"},
                {status: 500}
            );
        }

        await inngest.send({
            name: "newsletter.schedule",
            data: {
                categories,
                email,
                frequency,
                userId: user.id,
            }
        })

        return NextResponse.json({
            success: true,
            message: "Preferences saved and added to table",
        })
}

export async function GET() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if(!user){
        return NextResponse.json(
            {error: "You must be logged in to save prefrences."},
            {status: 401}
        );
    }

    try {
        const {data: preferences, error: fetchError} = await supabase
            .from("user_preferences")
            .select("*")
            .eq("user_id",user.id)
            .single();

        if(fetchError) {
            return NextResponse.json(
                {error: "Failed to save preferences"},
                {status: 500}
            );
        }

        return NextResponse.json(preferences);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {error: "Internal Error"},
            {status: 500}
        );

    }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  // Get the user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to update preferences." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { is_active } = body;

    // Update user preferences
    const { error: updateError } = await supabase
      .from("user_preferences")
      .update({ is_active })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating preferences:", updateError);
      return NextResponse.json(
        { error: "Failed to update preferences" },
        { status: 500 }
      );
    }

    if(!is_active){
        await inngest.send({
            name: "newsletter.schedule.deleted",
            data: {
                userId: user.id,
            },
        })
    }else {
        const {data: preferences,error} = await supabase
            .from("user_preferences")
            .select("categories,frequency,email")
            .eq("user_id",user.id)
            .single();

        if(error || !preferences){
            throw new Error("User preferences not found");
        }

        const now = new Date();
      let nextScheduleTime: Date;

      switch(preferences.frequency) {
        case "daily":
          nextScheduleTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case "weekly":
          nextScheduleTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case "biweekly":
          nextScheduleTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
          break;
        default:
          nextScheduleTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      }

      nextScheduleTime.setHours(9,0,0,0);

      await inngest.send({
        name: "newsletter.schedule",
          data: {
            categories: preferences.categories,
            email: preferences.email,
            frequency: preferences.frequency,
            userId: user.id,
          },
          ts: nextScheduleTime.getTime(),
      })
    }

    // If deactivating the newsletter, cancel all scheduled functions for this user
    // if (!is_active) {
    //   try {
    //     // Cancel all pending newsletter.schedule events for this user
    //     await cancelUserNewsletterEvents(user.id);
    //   } catch (cancelError) {
    //     console.error("Error canceling scheduled events:", cancelError);
    //     // Don't fail the request if cancellation fails, just log it
    //   }
    // } else {
    //   // If reactivating the newsletter, schedule the next one
    //   try {
    //     await rescheduleUserNewsletter(user.id);
    //   } catch (rescheduleError) {
    //     console.error("Error rescheduling newsletter:", rescheduleError);
    //     // Don't fail the request if rescheduling fails, just log it
    //   }
    // }

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
    });
  } catch (error) {
    console.error("Error in user-preferences PATCH API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}