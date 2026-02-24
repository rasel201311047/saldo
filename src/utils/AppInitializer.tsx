// import { router } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useEffect, useState } from "react";
// import { useGetMyProfileQuery } from "../redux/api/Auth/authApi";

// const AppInitializer = () => {
//   const [token, setToken] = useState<string | null>(null);
//   const [tokenLoaded, setTokenLoaded] = useState(false);
//   const [navigated, setNavigated] = useState(false);

//   // 1️⃣ Load token once
//   useEffect(() => {
//     const loadToken = async () => {
//       const storedToken = await SecureStore.getItemAsync("token");
//       setToken(storedToken);
//       setTokenLoaded(true);
//     };
//     loadToken();
//   }, []);

//   // 2️⃣ Fetch profile only if token exists
//   const { data, isLoading, isError } = useGetMyProfileQuery(undefined, {
//     skip: !tokenLoaded || !token,
//   });
//   console.log("==========================hello hi=================");
//   console.log(data?.data?.user?.isEmailVerified);

//   console.log("Token ", token);

//   useEffect(() => {
//     if (!tokenLoaded || navigated) return;

//     if (!token) {
//       setNavigated(true);
//       router.replace("/signin");
//       return;
//     }

//     if (isLoading) return;

//     if (isError || !data?.data?.user) {
//       setNavigated(true);
//       router.replace("/signin");
//       return;
//     }

//     // ✅ Success, user exists
//     setNavigated(true);
//     if (data?.data?.user?.isEmailVerified) {
//       if (data?.data?.user?.onboardingCompleted) {
//         router.replace("/home");
//       } else {
//         router.replace("/shiftSelection");
//       }
//     } else {
//       router.replace("/varify");
//     }
//   }, [tokenLoaded, token, isLoading, isError, data, navigated]);

//   return null;
// };

// export default AppInitializer;
