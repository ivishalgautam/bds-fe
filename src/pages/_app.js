import Layout from "@/components/Layout";
import { AllRoutes } from "@/data/sidebarData";
import "@/styles/globals.css";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Router from "next/router";
import Context from "@/store/context";

export default function App({ Component, pageProps }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnWindowFocus: false,
        queryCache: new QueryCache({
          onError: (error, query) => {
            // 🎉 only show error toasts if we already have data in the cache
            // which indicates a failed background update
            if (query.state.data !== undefined) {
            }
          },
        }),
      },
    },
  });
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const currentUser = JSON.parse(storedUser);

    if (router.pathname === "/login" || router.pathname === "/signup") {
      return;
    }

    // Find the current route in the AllRoutes array
    const currentRoute = AllRoutes.find(
      (route) => route.link === router.pathname
    );
    //  || route.link.includes(router.pathname)
    // If the current route is not found in the array or the user's role is not allowed for this route
    if (!currentRoute || !currentRoute.roles.includes(currentUser?.role)) {
      Router.push("/unauthorized");
    }
  }, [router.pathname]);

  const getContent = () => {
    // Array of all the paths that don't need the layout
    if (["/login", "/signup", "/unauthorized"].includes(router.pathname))
      return <Component {...pageProps} />;

    return (
      <Context>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Context>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        toastOptions={{
          duration: 5000,
          style: {
            fontSize: "14px",
          },
        }}
      />
      {getContent()}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
