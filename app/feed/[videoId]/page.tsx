interface PageProps {
  params: Promise<{ videoId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  return <>{videoId}</>;
};

export default Page;
