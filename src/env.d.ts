/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

declare namespace App {
  interface Locals {
    cmsMedia?: import('./lib/marketing-content').MediaMap;
  }
}
