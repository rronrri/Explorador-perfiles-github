import type { Metadata } from "next";
import HomeView from "../views/HomeView";

export const metadata: Metadata = {
  title: "Rodrigo Ortiz · Full-stack developer",
  description: "Portfolio of Rodrigo Ortiz Barahona: projects, interactive demos and a GitHub profile explorer",
};

export default function HomeEn() {
  return <HomeView lang="en" />;
}
