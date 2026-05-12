const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "rdf",
        name: "rdf_workflow_v2",
        component: () => import("src/modules/rdf/pages/RdfWorkflowPage.vue"),
      },
      {
        path: "view",
        name: "view_dm4",
        component: () => import("pages/ViewDM4.vue"),
      },
      {
        path: "acom-workflow",
        name: "acom_workflow",
        component: () =>
          import("src/modules/acom/pages/AcomWorkflowPage.vue"),
      },
      {
        path: "calibration",
        name: "calibration",
        component: () => import("layouts/CalibrationLayout.vue"),
        children: [
          {
            path: "center_calibration",
            name: "center_calibration",
            component: () => import("pages/CenterCalibration.vue"),
          },
          {
            path: "elipse_calibration",
            name: "elipse_calibration",
            component: () => import("pages/ElipseCalibration.vue"),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
