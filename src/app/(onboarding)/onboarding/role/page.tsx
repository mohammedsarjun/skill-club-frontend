"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Checkbox from "@/components/common/CheckBox";
import Button from "@/components/common/Button";
import Image from "next/image";
import { userApi } from "@/api/userApi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { RootState } from "@/store";

function ChooseRolePage() {
  const router = useRouter();
  const dispatch = useDispatch()

  const user = useSelector((state: RootState) => state.auth.user);



  async function handleChoice(role: "freelancer" | "client") {



    if (role == "client") {
      router.push("/onboarding/client");
    } else {
      router.push("/onboarding/freelancer/0");
    }



  }

  const [role, setRole] = useState<"client" | "freelancer" | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white signUp bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl space-y-6 flex flex-col items-center justify-center">
        <h2 className="text-4xl">Join as a client or freelancer</h2>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Client Card */}
          <div
            onClick={() => setRole("client")}
            className={`relative border rounded-2xl p-6 cursor-pointer transition ${role === "client"
              ? "border-blue-600 shadow-md"
              : "border-gray-300 hover:border-blue-400"
              }`}
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              {/* SVG icon placeholder */}
              <div className="w-8 h-8 flex justify-center text-center">

                <Image
                  src="/icons/client-icon.svg"
                  alt="client"
                  width={30}
                  height={30}
                />
              </div>
              <Checkbox name="client" checked={role == "client"} sizeClass="w-6 h-6"></Checkbox>
            </div>

            {/* Content */}
            <h2 className="mt-4 font-semibold text-lg">I'm a client, hiring for a project</h2>

          </div>

          {/* Freelancer Card */}
          <div
            onClick={() => setRole("freelancer")}
            className={`relative border rounded-2xl p-6 cursor-pointer transition ${role === "freelancer"
              ? "border-green-600 shadow-md"
              : "border-gray-300 hover:border-green-400"
              }`}
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              {/* SVG icon placeholder */}
              <div className="w-8 h-8 rounded">
                <Image
                  src="/icons/freelancer-icon.svg"
                  alt="freelancer"
                  width={30}
                  height={30}
                />
              </div>
              <Checkbox name="freelancer" checked={role == 'freelancer'} sizeClass="w-6 h-6"></Checkbox>
            </div>

            {/* Content */}
            <h2 className="mt-4 font-semibold text-lg">I'm a freelancer looking for work</h2>
            <p className="text-gray-600 mt-2">

            </p>
          </div>
        </div>

        {/* Create account button */}
        <Button content="Create Account" type="submit" className=" mt-10 px-8 py-3" onClick={() => {
          if (role === "client") {
            handleChoice("client")
          } else if (role === "freelancer") {
            handleChoice("freelancer")
          }
        }} disabled={!role}></Button>

      </div>
    </div>)
}


export default function ChooseRole() {
  return (

      <ChooseRolePage></ChooseRolePage>

  )
}