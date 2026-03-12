import { analyticsBrowser } from "./analytics.defaults.client";

export type TrackEvents = {
  /**
   * TRACK - Contact Form Started
   *
   * @description Track when a user first interacts with the contact form
   */
  "Contact Form Started": {
    page_section: "home" | "about" | "services" | "insights";
  };

  /**
   * TRACK - Contact Form Submitted
   *
   * @description Track when a user submits the contact form
   */
  "Contact Form Submitted": {
    page_section: "home" | "about" | "services" | "insights";
    has_organization: boolean;
  };

  /**
   * TRACK - CTA Clicked
   *
   * @description Track when a user clicks a homepage CTA button
   */
  "CTA Clicked": {
    cta_label: "Contact Us" | "Learn More About Us" | "Explore Our Services" | "Access Our Insights";
  };

  /**
   * TRACK - Contact Link Clicked
   *
   * @description Track when a user clicks a contact section link
   */
  "Contact Link Clicked": {
    link_type: "email" | "phone" | "location" | "linkedin";
  };

  /**
   * TRACK - Leader LinkedIn Clicked
   *
   * @description Track when a user clicks a leadership team member's LinkedIn profile
   */
  "Leader LinkedIn Clicked": {
    leader_name: string;
  };

  /**
   * TRACK - Service Accordion Expanded
   *
   * @description Track when a user expands a service accordion on the services page
   */
  "Service Accordion Expanded": {
    service_title: string;
    service_index: number;
  };

  /**
   * TRACK - Newsletter Form Started
   *
   * @description Track when a user first interacts with the newsletter signup form
   */
  "Newsletter Form Started": Record<string, never>;

  /**
   * TRACK - Newsletter Form Submitted
   *
   * @description Track when a user submits the newsletter signup form
   */
  "Newsletter Form Submitted": Record<string, never>;

  /**
   * TRACK - Language Toggled
   *
   * @description Track when a user toggles the language of the site
   */
  "Language Toggled": {
    switchingFromLanguage: "en" | "fr";
    switchingToLanguage: "en" | "fr";
    locationOnPage: "directory-menu" | "footer";
  };

  /**
   * TRACK - YouTube Video Events
   *
   * @description Track when a user starts, seeks, buffers, pauses, resumes, completes, or progresses through a YouTube video
   */
  "Video Content Started": {
    // custom-added properties
    previous_played_seconds: number;
    current_played_seconds: number;
    video_title: string;
    // content properties
    position?: number;
    title?: string;
    description?: string;
    keywords?: string[];
    channel?: string;
    airdate?: string; // ISO 8601 date string
  };
  "Video Content Completed": {
    // custom-added properties
    previous_played_seconds: number;
    current_played_seconds: number;
    video_title: string;
    // content properties
    position?: number;
    title?: string;
    description?: string;
    keywords?: string[];
    channel?: string;
    airdate?: string; // ISO 8601 date string
  };
  "Video Playback Started": any;
  "Video Playback Seek Started": any;
  "Video Playback Seek Completed": {
    // custom-added properties
    previous_played_seconds: number;
    current_played_seconds: number;
    video_title: string;
    // playback properties
    video_player: string;
    position?: number;
    quality?: string | "unknown";
    sound?: number;
    total_length?: number;
  };
  "Video Playback Buffer Started": any;
  "Video Playback Buffer Completed": any;
  "Video Playback Paused": any;
  "Video Playback Resumed": any;
  "Video Playback Completed": {
    // custom-added properties
    previous_played_seconds: number;
    current_played_seconds: number;
    video_title: string;
    // playback properties
    video_player: string;
    position?: number;
    quality?: string | "unknown";
    sound?: number;
    total_length?: number;
  };
  "Video Progress Reached": {
    // custom-added properties
    previous_played_seconds: number;
    current_played_seconds: number;
    video_title: string;
    // ad-hoc properties
    watched_percentage: number;
    // playback properties
    video_player: string;
    position?: number;
    quality?: string | "unknown";
    sound?: number;
    total_length?: number;
  };
};

/**
 * TRACK - Track an event
 *
 * @description Track an event
 */
export function browserTrackEvent<E extends keyof TrackEvents>(eventName: E, eventProps: TrackEvents[E]) {
  analyticsBrowser.track(eventName, eventProps ?? {});
}

/**
 * IDENTIFY - Identify a user
 *
 * @description Identify a user
 */
export function browserIdentifyEvent(eventProps: {
  userId?: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
}) {
  if (eventProps.userId) {
    analyticsBrowser.identify(eventProps.userId, eventProps);
  } else {
    analyticsBrowser.identify(eventProps);
  }
}

/**
 * PAGE - Page Viewed
 *
 * @description Track when a user views a page
 */
export function browserPageEvent(eventProps: { language: "en" | "fr" }) {
  analyticsBrowser.page(undefined, undefined, {
    ...eventProps,
  });
}
