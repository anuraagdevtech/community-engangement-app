"use client";

import * as React from "react";
import { Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { PhoneAuthForm } from "@/components/auth/phone-auth-form";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [name, setName] = React.useState("");

  return (
    <div className="flex flex-col gap-5">
      {mode === "signup" && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">What should neighbours call you?</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Priya from Block C"
          />
        </div>
      )}

      <OAuthButtons />

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with
        <span className="h-px flex-1 bg-border" />
      </div>

      <Tabs defaultValue="email">
        <TabsList className="w-full">
          <TabsTrigger value="email" className="flex-1">
            <Mail className="h-3.5 w-3.5" /> Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="flex-1">
            <Phone className="h-3.5 w-3.5" /> Phone
          </TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <EmailAuthForm mode={mode} name={name} />
        </TabsContent>
        <TabsContent value="phone">
          <PhoneAuthForm mode={mode} name={name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
