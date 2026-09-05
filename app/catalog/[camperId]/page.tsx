type CamperDetailsPageProps = {
  params: Promise<{
    camperId: string;
  }>;
};

export default async function CamperDetailsPage({
  params,
}: CamperDetailsPageProps) {
  const { camperId } = await params;

  return (
    <main>
      <h1>Camper details</h1>
      <p>Camper ID: {camperId}</p>
    </main>
  );
}