import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Heading,
} from "react-email";

export default function ResetPasswordEmail(resetLink: string) {
  return (
    <Tailwind>
      <Html>
        <Head />

        <Preview>Reset your password</Preview>

        <Body className="bg-gray-100 py-10">
          <Container className="bg-white p-10 rounded-lg">
            <Heading className="text-2xl font-bold">
              Reset your password
            </Heading>

            <Text className="text-gray-700">
              We received a request to reset your password.
            </Text>

            <Section className="my-8">
              <Button
                href={resetLink}
                className="bg-black text-white px-6 py-3 rounded-md"
              >
                Reset Password
              </Button>
            </Section>

            <Text className="text-sm text-gray-500">
              If you didn’t request this, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
