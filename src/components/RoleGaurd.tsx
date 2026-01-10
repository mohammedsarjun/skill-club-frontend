// // components/RoleGuard.tsx
// "use client";

// import { useSelector } from "react-redux";
// import { RootState } from "@/store/index";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// interface Props {
//   allowedRoles: string[];
//   children: React.ReactNode;
// }

// export default function RoleGuard({ allowedRoles, children }: Props) {
//   const user = useSelector((state: RootState) => state.auth.user);
//   const router = useRouter();

//   useEffect(() => {
//     console.log(user)
//     if (!user) {
//       // Not logged in
//       router.replace("/login");
//     } else if (!user.activeRole) {
//       // User has no active role yet → redirect to onboarding/role selection
//       router.replace("/onboarding/role");
//     } else if (!allowedRoles.includes(user.activeRole)) {
//       // Active role is not allowed for this page → unauthorized
//       router.replace("/unauthorized");
//     }
//   }, [user, router, allowedRoles]);

//   // Prevent rendering while redirecting
//   if (!user || !user.activeRole || !allowedRoles.includes(user.activeRole)) {
//     return null;
//   }

//   return <>{children}</>;
// }
