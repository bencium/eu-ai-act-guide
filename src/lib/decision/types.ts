export type CoverageStatus =
  | "likely_in_scope"
  | "possible_exemption"
  | "no_trigger_found"
  | "unclear";

export type ContentLabellingStatus =
  | "required"
  | "not_required_from_these_answers"
  | "unclear";

export type SourceAuthority = "law" | "official_guidance" | "voluntary_code";

export type OrganisationRole =
  | "provider"
  | "professional_deployer"
  | "importer"
  | "distributor"
  | "product_manufacturer"
  | "public_authority"
  | "affected_person"
  | "personal_user"
  | "unsure";

export type OrganisationSize =
  | "personal"
  | "micro"
  | "small"
  | "medium"
  | "small_mid_cap"
  | "large"
  | "public_authority"
  | "non_profit_or_other"
  | "unsure";

export interface RecordedAnswer {
  questionId: string;
  answerId: string;
}

export interface LegalCitation {
  sourceId: string;
  authority: SourceAuthority;
  reference: string;
  url: string;
}

export interface ApplicationDate {
  date: string;
  state: "applies" | "future" | "transition" | "depends";
  label: string;
  citations: LegalCitation[];
}

export interface DecisionResult<Status extends string> {
  status: Status;
  statusText: string;
  answers: RecordedAnswer[];
  known: string[];
  unknown: string[];
  possibleRole: string;
  citations: LegalCitation[];
  dates: ApplicationDate[];
  nextAction: string;
  disclaimer: string;
}

export interface PenaltyContext {
  regime: "article_99" | "article_101" | "member_state_rules" | "other";
  provisionBand: "article_5" | "operator_duties" | "authority_information" | "gpai" | "other";
  fixedAmountEur?: number;
  turnoverPercent?: number;
  calculationRule: "higher_of" | "lower_of" | "national_rule" | "separate_article_101" | "not_calculated";
  label: string;
  factors: string[];
  citations: LegalCitation[];
}

export interface CoverageInput {
  euConnection:
    | "provider_places_in_eu"
    | "deployer_in_eu"
    | "output_used_in_eu"
    | "imports_or_distributes_in_eu"
    | "regulated_product_in_eu"
    | "people_in_eu_affected"
    | "none_found"
    | "unsure";
  role: OrganisationRole;
  intendedUse:
    | "content_generation"
    | "chatbot_or_agent"
    | "biometric_or_emotion"
    | "employment"
    | "education"
    | "essential_services"
    | "credit"
    | "life_or_health_insurance"
    | "public_services"
    | "law_enforcement"
    | "migration"
    | "justice"
    | "democratic_processes"
    | "critical_infrastructure"
    | "regulated_product_safety"
    | "ordinary_internal_assistance"
    | "unsure";
  context:
    | "professional_or_economic"
    | "personal_non_professional"
    | "pre_market_research_testing"
    | "sole_purpose_scientific_research"
    | "military_defence_national_security"
    | "free_open_source_release"
    | "unsure";
  industry?: string;
  organisationSize: OrganisationSize;
  timing:
    | "before_2026_08_02"
    | "on_or_after_2026_08_02"
    | "not_on_market"
    | "unsure";
  additional?: {
    realWorldTesting?: boolean;
    article5Concern?: boolean;
    article50Concern?: boolean;
    annexIProduct?: boolean;
    annexIIIUse?: boolean;
    uncertainSpecificFact?: boolean;
    identifiedProvision?: "article_5" | "operator_duties" | "authority_information" | "gpai" | "other";
  };
}

export interface CoverageResult extends DecisionResult<CoverageStatus> {
  penalty: PenaltyContext;
  reasons: string[];
}

export interface LabellingInput {
  role: "provider" | "professional_deployer" | "personal_user" | "unsure";
  contentType:
    | "text"
    | "image"
    | "audio"
    | "video"
    | "mixed"
    | "chatbot_agent"
    | "emotion_recognition"
    | "biometric_categorisation";
  change: "generated" | "substantially_manipulated" | "standard_editing" | "non_substantive" | "not_applicable";
  realisticOrPlausible?: boolean;
  publicInterest?: boolean;
  editorialControl?: "substantive_final" | "spelling_only" | "none" | "not_applicable";
  editorialResponsibilityAccepted?: boolean;
  disclosureAtFirstExposure?: boolean;
  interactionObviouslyAI?: boolean;
  setting?: "work" | "education" | "other";
  systemPlacedBefore2026August2?: boolean;
}

export interface LabellingDuty {
  kind:
    | "machine_readable_marking"
    | "visible_or_audible_deepfake_disclosure"
    | "public_interest_text_disclosure"
    | "direct_interaction_notice"
    | "emotion_or_biometric_notice"
    | "prohibited_use_check";
  channel: "machine_readable" | "visible_or_audible" | "before_or_at_interaction" | "separate_legal_check";
  required: boolean;
  explanation: string;
  exampleWording?: string;
  citations: LegalCitation[];
}

export interface LabellingResult extends DecisionResult<ContentLabellingStatus> {
  duties: LabellingDuty[];
  optionalIcon: {
    available: boolean;
    replacesWords: false;
    provesCompliance: false;
    url: string;
  };
}

export interface EverydayInput {
  setting:
    | "work_or_recruitment"
    | "education_or_training"
    | "health_insurance_credit_services"
    | "government_justice_policing_migration"
    | "online_content_chatbot_agent"
      | "biometric_emotion"
      | "ordinary_consumer_or_workplace";
  perceivedEffect:
    | "recommendation_or_ranking"
    | "important_decision"
    | "monitoring_or_profiling"
    | "ai_interaction_or_content"
    | "identity_biometric_or_emotion"
    | "other_or_unsure";
  decisionImpact?:
    | "access_price_or_eligibility"
    | "work_or_education_outcome"
    | "official_or_legal_outcome"
    | "information_or_disclosure_only"
    | "no_significant_effect_known"
    | "unsure";
  humanHelpRoute: "available" | "unavailable" | "not_requested" | "unsure";
}

export interface EverydayResult extends DecisionResult<"unclear"> {
  whyItMayMatter: string;
  whatPersonCanAsk: string[];
  possibleRoutes: string[];
}

export interface GraphOption {
  id: string;
  next: string;
}

export interface GraphNode {
  id: string;
  options: GraphOption[];
}

export interface DecisionGraph {
  id: string;
  start: string;
  nodes: GraphNode[];
  resultIds: string[];
}
