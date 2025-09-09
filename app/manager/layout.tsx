import Navigation from "@/components/manager/Navigation";

export default function managerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return(
        <>
          <Navigation/>
          {children}
        </>
    )
}