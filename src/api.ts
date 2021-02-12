// Advanced API definition
export interface APIDefinition {
  /// Default variable name
  readonly id: string;
  /// JSON for Autocomplete macros
  readonly url: string;
  readonly innerName: string;
  readonly abbreviatedName: string;
}

export const definitions: APIDefinition[] = [
  {
    id: "AdSense",
    innerName: "Adsense_v1_4",
    abbreviatedName: "Adsense.V1_4.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/adsense/v1.4",
  },
  {
    id: "AdminDirectory",
    innerName: "Admin_directory_v1",
    abbreviatedName: "Admin.Directory_v1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/admin/directory_v1",
  },
  {
    id: "AdminReports",
    innerName: "Admin_reports_v1",
    abbreviatedName: "Admin.Reports_v1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/admin/reports_v1",
  },
  {
    id: "AnalyticsReporting",
    innerName: "Analyticsreporting_v4",
    abbreviatedName: "Analyticsreporting.V4.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/analyticsreporting/v4",
  },
  {
    id: "Area120Tables",
    innerName: "Area120tables_v1alpha1",
    abbreviatedName: "Area120tables.V1alpha1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/area120tables/v1alpha1",
  },
  {
    id: "BigQuery",
    innerName: "Bigquery_v2",
    abbreviatedName: "Bigquery.V2.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/bigquery/v2",
  },
  {
    id: "Calendar",
    innerName: "Calendar_v3",
    abbreviatedName: "Calendar.V3.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/calendar/v3",
  },
  {
    id: "DoubleClickCampaigns",
    innerName: "Dfareporting_v3_4",
    abbreviatedName: "Dfareporting.V3_4.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/dfareporting/v3.4",
  },
  {
    id: "ShoppingContent",
    innerName: "Content_v2",
    abbreviatedName: "Content.V2.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/content/v2",
  },
  {
    id: "Drive",
    innerName: "Drive_v2",
    abbreviatedName: "Drive.V2.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/drive/v2",
  },
  {
    id: "DriveActivity",
    innerName: "Driveactivity_v2",
    abbreviatedName: "Driveactivity.V2.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/driveactivity/v2",
  },
  {
    id: "AdminLicenseManager",
    innerName: "Licensing_v1",
    abbreviatedName: "Licensing.V1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/licensing/v1",
  },
  {
    id: "Gmail",
    innerName: "Gmail_v1",
    abbreviatedName: "Gmail.V1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/gmail/v1",
  },
  {
    id: "Analytics",
    innerName: "Analytics_v3",
    abbreviatedName: "Analytics.V3.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/analytics/v3",
  },
  {
    id: "Classroom",
    innerName: "Classroom_v1",
    abbreviatedName: "Classroom.V1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/classroom/v1",
  },
  {
    id: "Docs",
    innerName: "Docs_v1",
    abbreviatedName: "Docs.V1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/docs/v1",
  },
  {
    id: "Sheets",
    innerName: "Sheets_v4",
    abbreviatedName: "Sheets.V4.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/sheets/v4",
  },
  {
    id: "Slides",
    innerName: "Slides_v1",
    abbreviatedName: "Slides.V1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/slides/v1",
  },
  {
    id: "AdminReseller",
    innerName: "Reseller_v1",
    abbreviatedName: "Reseller.V1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/reseller/v1",
  },
  {
    id: "AdminGroupsMigration",
    innerName: "Groupsmigration_v1",
    abbreviatedName: "Groupsmigration.V1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/groupsmigration/v1",
  },
  {
    id: "AdminGroupsSettings",
    innerName: "Groupssettings_v1",
    abbreviatedName: "Groupssettings.V1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/groupssettings/v1",
  },
  {
    id: "Mirror",
    innerName: "==== NOT FOUND ====",
    abbreviatedName: "==== NOT FOUND ====",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/mirror/v1",
  },
  {
    id: "People",
    innerName: "Peopleapi_v1",
    abbreviatedName: "Peopleapi.V1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/peopleapi/v1",
  },
  {
    id: "TagManager",
    innerName: "Tagmanager_v2",
    abbreviatedName: "Tagmanager.V2.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/tagmanager/v2",
  },
  {
    id: "Tasks",
    innerName: "Tasks_v1",
    abbreviatedName: "Tasks.V1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/tasks/v1",
  },
  {
    id: "YouTubeAnalytics",
    innerName: "YoutubeAnalytics_v2",
    abbreviatedName: "YoutubeAnalytics.V2.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/youtubeAnalytics/v2",
  },
  {
    id: "YouTubeContentId",
    innerName: "YoutubePartner_v1",
    abbreviatedName: "YoutubePartner.V1.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/youtubePartner/v1",
  },
  {
    id: "YouTube",
    innerName: "Youtube_v3",
    abbreviatedName: "Youtube.V3.",
    url: "https://script.google.com/macros/autocomplete/dep/apiary/youtube/v3",
  },
];
