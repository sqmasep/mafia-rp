import {
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import trpc from "../../lib/trpc";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { login } from "../../../../server/data/formSchemas";
import { useUser } from "../../contexts/UserContext";
import { useToken } from "../../contexts/TokenContext";

const Login: React.FC = () => {
  const { user } = useUser();
  const { setToken } = useToken();

  const utils = trpc.useContext();
  const mutation = trpc.user.login.useMutation({
    onSuccess: data => {
      setToken(data.token);
      utils.user.getInfos.invalidate();
    },
  });
  const logIn = ({ password, username }) => {
    mutation.mutate({ password, username });
  };

  return (
    <Container>
      <Formik
        initialValues={login.initialValues}
        validationSchema={toFormikValidationSchema(login.schema)}
        onSubmit={logIn}
      >
        {({ values, errors, isSubmitting, touched }) => {
          return (
            <Form>
              <pre>{JSON.stringify(user, null, 2)}</pre>

              <Paper sx={{ p: 4, width: "50%", mx: "auto" }}>
                <Stack direction='column' spacing={2}>
                  <Typography variant='h2' component='h1' mb={4}>
                    Login
                  </Typography>
                  <Field
                    name='username'
                    as={TextField}
                    label='Username'
                    helperText={touched.username && errors.username}
                    error={touched.username && !!errors.username}
                    fullWidth
                  />
                  <Field
                    name='password'
                    as={TextField}
                    label='Password'
                    helperText={touched.password && errors.password}
                    error={touched.password && !!errors.password}
                    fullWidth
                  />
                  <Button type='submit' fullWidth sx={{ mt: 90 }}>
                    Log in
                  </Button>
                </Stack>
              </Paper>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default Login;
