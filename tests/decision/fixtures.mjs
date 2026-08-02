export function coverageFixture(overrides = {}) {
  return {
    euConnection: "deployer_in_eu",
    role: "professional_deployer",
    intendedUse: "ordinary_internal_assistance",
    context: "professional_or_economic",
    industry: "other",
    organisationSize: "large",
    timing: "on_or_after_2026_08_02",
    ...overrides,
  };
}

export function labelFixture(overrides = {}) {
  return {
    role: "professional_deployer",
    contentType: "image",
    change: "generated",
    realisticOrPlausible: true,
    disclosureAtFirstExposure: true,
    ...overrides,
  };
}
