"use client";

import { useActionState } from "react";

import { signInAction, signUpAction, type FormActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialState: FormActionState = {};

export function AuthPanel() {
  const [signInState, signInFormAction, signInPending] = useActionState(signInAction, initialState);
  const [signUpState, signUpFormAction, signUpPending] = useActionState(signUpAction, initialState);

  return (
    <Card className="rounded-xl bg-[var(--surface-strong)]">
      <CardContent className="p-4 sm:p-5">
        <Tabs defaultValue="sign-in">
          <TabsList>
            <TabsTrigger value="sign-in">Sign in</TabsTrigger>
            <TabsTrigger value="sign-up">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in">
            <p className="mb-3 text-sm leading-6 text-[var(--muted)]">
              Access scheduling, charting, portal, and operations workflows.
            </p>
            <form action={signInFormAction} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="sign-in-email">Email</Label>
                <Input id="sign-in-email" name="email" type="email" placeholder="you@clinic.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sign-in-password">Password</Label>
                <Input id="sign-in-password" name="password" type="password" placeholder="************" />
              </div>
              {signInState.error ? <p className="text-sm text-[var(--danger)]">{signInState.error}</p> : null}
              <Button className="w-full" disabled={signInPending} type="submit">
                {signInPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="sign-up">
            <p className="mb-3 text-sm leading-6 text-[var(--muted)]">
              Patient self-registration routes new users into the intake and portal flow.
            </p>
            <form action={signUpFormAction} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" placeholder="Jordan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" placeholder="Lee" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="sign-up-email">Email</Label>
                <Input id="sign-up-email" name="email" type="email" placeholder="patient@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" placeholder="9175550100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sign-up-password">Password</Label>
                <Input id="sign-up-password" name="password" type="password" placeholder="At least 10 characters" />
              </div>
              {signUpState.error ? <p className="text-sm text-[var(--danger)] sm:col-span-2">{signUpState.error}</p> : null}
              {signUpState.success ? <p className="text-sm text-[var(--success)] sm:col-span-2">{signUpState.success}</p> : null}
              <Button className="sm:col-span-2" disabled={signUpPending} type="submit">
                {signUpPending ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
