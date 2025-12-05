import React from "react";
import { useLocation, useParams } from "react-router";

export default function PrjMaterialInv() {
  const { id } = useParams();
  const { state } = useLocation();

  const project = state?.project;

  return (
    <>
      <h1 className="text-2xl font-bold">Project Material Inventory</h1>

      <p>Project ID: {id}</p>

      {project && (
        <p className="text-lg text-gray-600">
          Project Name: {project.name}
        </p>
      )}

      {/* <DashCards metrics={metrics} /> */}
    </>
  );
}
