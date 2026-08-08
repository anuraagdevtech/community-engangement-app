"use client";

import * as React from "react";
import { Loader2, PenSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CHANNELS } from "@/lib/channels";
import { cn } from "@/lib/utils";
import { toWKTPoint } from "@/lib/geo";
import { createClient } from "@/lib/supabase/client";
import type { Channel } from "@/lib/types/database.types";
import type { LatLng } from "@/components/providers/location-provider";

export function PostComposer({ center, onPosted }: { center: LatLng; onPosted: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [channel, setChannel] = React.useState<Channel>("general");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in again.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      channel,
      title,
      body: body || null,
      location: toWKTPoint(center) as unknown as never,
    });

    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Posted to your neighbourhood");
    setTitle("");
    setBody("");
    setChannel("general");
    setOpen(false);
    onPosted();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          <PenSquare className="h-4 w-4" />
          Post to your Mohalla
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New post</DialogTitle>
          <DialogDescription>Visible to verified neighbours within your active radius.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label className="mb-2 block">Channel</Label>
            <div className="flex flex-wrap gap-2">
              {CHANNELS.map((c) => {
                const Icon = c.icon;
                const active = channel === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setChannel(c.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      active ? "border-transparent text-white" : "border-border bg-card text-muted-foreground hover:bg-accent",
                    )}
                    style={active ? { backgroundColor: c.color } : undefined}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Water tanker delayed till 6pm today"
              required
              maxLength={120}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-body">Details (optional)</Label>
            <Textarea
              id="post-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add any useful context for your neighbours…"
              maxLength={1000}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
