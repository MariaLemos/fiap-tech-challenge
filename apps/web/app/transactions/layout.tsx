export default function TransactionsLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}


