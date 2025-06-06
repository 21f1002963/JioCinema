"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { api, ENDPOINT } from "@/lib/api";
import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedInDetails } from "@/redux/userSlice";
import { toast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const userData = useSelector((state) => state.user);

  if (userData.isLoggedIn) {
    router.push("/");
    return null;
  }

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (email.length === 0 || password.length === 0) {
        toast({ title: "Please fill all fields" });
      }
      const res = await api.post(ENDPOINT.login, {
        email: email,
        password: password,
      });
      if (res.data.status === "success") {
        dispatch(userLoggedInDetails(res.data.message));
        router.push("/");
      }
    } catch (err) {
      console.log("err: ", err);
      toast({ title: "Invalid credentials", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={loading} onClick={onSubmit} className="w-full">
            Sign in
            {loading && <LucideLoader2 className="animate-spin ml-2 w-4 h-4" />}
          </Button>
        </CardFooter>
        <div className="mt-4 text-center text-sm pb-6 flex justify-between px-6">
          <Link href="/resetPassword">Forgot Password?</Link>
          <div>
            Need an account?{" "}
            <Link href="/signup" className="underline">
              Sign Up
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
