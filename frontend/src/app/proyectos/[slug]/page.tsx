import ProjectView, { projectMetadata, projectParams } from "../../views/ProjectView";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = projectParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  return projectMetadata((await params).slug, "es");
}

export default async function ProjectPage({ params }: Props) {
  return <ProjectView slug={(await params).slug} lang="es" />;
}
