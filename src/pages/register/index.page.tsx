import { ArrowRight } from "phosphor-react";
import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container, Form, FromError, Header } from "./styles";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/axios";
import { NextSeo } from "next-seo";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O usuário precisa ter pelo menos 3 caracteres." })
    .regex(/^([a-z\\-]+)$/, {
      message: "O usuário deve possuir apenas letras e hifens",
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: "O usuário precisa ter pelo menos 3 Letras." }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) {
      setValue("username", String(router.query.username));
    }
  }, [router.query?.username, setValue]);

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });

      await router.push("/register/connect-calendar");
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message);
        return;
      }
      console.error(err);
    }
  }

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />
      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuario</Text>
            <TextInput
              prefix="ignite.com/"
              placeholder="seu-usuario"
              {...register("username")}
            />
            {errors.username && (
              <FromError size="sm">{errors.username.message}</FromError>
            )}
          </label>
          <label>
            <Text size="sm">Nome Completo</Text>
            <TextInput placeholder="Seu nome" {...register("name")} />
            {errors.name && (
              <FromError size="sm">{errors.name.message}</FromError>
            )}
          </label>
          <Button size="sm" type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  );
}
