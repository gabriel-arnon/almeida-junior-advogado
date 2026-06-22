type ContactEvent = {
  event:
    | "contact_mock_delivery"
    | "contact_delivery_success"
    | "contact_delivery_failure"
    | "contact_configuration_invalid"
    | "contact_rate_limited"
    | "contact_rate_limit_unavailable";
  requestId: string;
  status: string;
};

export function logContactEvent(event: ContactEvent) {
  console.info("contact_event", {
    event: event.event,
    requestId: event.requestId,
    status: event.status,
    timestamp: new Date().toISOString()
  });
}
