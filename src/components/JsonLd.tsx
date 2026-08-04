/**
 * Renders a JSON-LD block.
 *
 * Server component on purpose: emitting `<script>` with `dangerouslySetInnerHTML` from a client
 * component risks hydration mismatch warnings, and none of this needs to be interactive.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
