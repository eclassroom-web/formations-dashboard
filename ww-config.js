export default {
  editor: {
    label: { en: "Formations Dashboard" },
  },
  content: {
    formations: {
      label: { en: "Formations" },
      type: "Array",
      options: {
        item: {
          type: "Object",
        },
      },
      defaultValue: [
        {
          id: "1",
          title: "Introduction au Trading",
          cover_image: null,
          category: "Trading",
          niveau: "Débutant",
          moodle_course_id: 101,
          status: "published",
          created_at: "2025-01-15T10:00:00Z",
        },
        {
          id: "2",
          title: "Marketing Digital Avancé",
          cover_image: null,
          category: "Marketing",
          niveau: "Avancé",
          moodle_course_id: 102,
          status: "draft",
          created_at: "2025-02-20T14:30:00Z",
        },
        {
          id: "3",
          title: "Analyse Technique des Marchés",
          cover_image: null,
          category: "Trading",
          niveau: "Intermédiaire",
          moodle_course_id: 103,
          status: "published",
          created_at: "2025-03-05T09:00:00Z",
        },
      ],
    },
  },
  triggerEvents: [
    {
      name: "publish-change",
      label: { en: "On publish toggle" },
      event: { id: "", status: "" },
    },
    {
      name: "create-formation",
      label: { en: "On create formation" },
      event: {},
    },
    {
      name: "edit-formation",
      label: { en: "On edit formation" },
      event: { id: "" },
    },
    {
      name: "delete-formation",
      label: { en: "On delete formation" },
      event: { id: "" },
    },
    {
      name: "preview-formation",
      label: { en: "On preview formation" },
      event: { id: "" },
    },
    {
      name: "settings-formation",
      label: { en: "On settings formation" },
      event: { id: "" },
    },
  ],
};
