import React, { useContext, useEffect, useState } from "react";

import { Box, Form, FormField, RadioButtonGroup, Text, ResponsiveContext } from "grommet";

import AuthenticationContext from "../contexts/authentication-context/context";
import CartContext from "../contexts/cart-context/context";

interface IProps {
  setIsCardValid;
  isCardValid: boolean;
  setIsPayPhoneValid;
  isPayPhoneValid: boolean;
  setIsPayMailValid;
  isPayMailValid: boolean;
}

const PaymentForm = (props: IProps) => {
  const { user } = useContext(AuthenticationContext);
  const { paymentMethod, paymentMethods, setPayment } = useContext(CartContext);

  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  const size = useContext(ResponsiveContext) as
        | "small"
        | "medium"
        | "large"
        | "xlarge"

  useEffect(() => {
    checkCardValidation();
  }, [cardNumber, cardExp, cardCVC]);

  const cardnoVisa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  const cardnoMasterCard = /^(?:5[1-5][0-9]{14})$/;

  const checkCardValidation = () => {
    if (
      cardNumber.match(cardnoMasterCard || cardnoVisa) &&
      cardExp.match(/^(0?[1-9]|1[012])[/-](?:202[0-5])/) &&
      cardCVC.match(/^\d{3}$/)
    ) {
      props.setIsCardValid(true);
    } else {
      props.setIsCardValid(false);
    }
  };

  const checkPhoneValidation = (event) => {
    if (
      event.target.value.match(
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
      )
    ) {
      props.setIsPayPhoneValid(true);
    } else {
      props.setIsPayPhoneValid(false);
    }
  };

  const checkMailValidation = (event) => {
    if (event.target.value.match(/^\w+([.-]?w+)*@\w+([.-]?w+)*(\.\w{2,3})+$/)) {
      props.setIsPayMailValid(true);
    } else {
      props.setIsPayMailValid(false);
    }
  };

  const transformMethodsToGrommetRadioButton = () => {
    return paymentMethods.map((method) => ({
      label: method.type,
      value: method.type,
    }));
  };

  return (
    <Form style={{ gridArea: "name" }} validate="blur">
      <Box align="center">
        <RadioButtonGroup
          margin={{ vertical: "medium" }}
          direction={
            size === "small" || size === "medium"
            ? "column"
            : "row"
          }
          name="radio"
          options={transformMethodsToGrommetRadioButton()}
          value={paymentMethod.type}
          onChange={(e) => {
            setPayment(
              paymentMethods.find((method) => method.type === e.target.value)
            );
          }}
        />
      </Box>
      {paymentMethod.type === "INVOICE" ? (
        <FormField
          key={1}
          name="email"
          autoComplete="email"
          label={
            <Box direction="row">
              <Text>E-mail</Text>
              <Text color="status-critical">*</Text>
            </Box>
          }
          required
          type="email"
          value={user.email}
          onChange={(event) => checkMailValidation(event)}
          validate={[
            { regexp: /^\w+([.-]?w+)*@\w+([.-]?w+)*(\.\w{2,3})+$/ },
            (name) => {
              if (!name.match(/^\w+([.-]?w+)*@\w+([.-]?w+)*(\.\w{2,3})+$/))
                return "Not a valid e-mail";
              return undefined;
            },
          ]}
        />
      ) : paymentMethod.type === "SWISH" ? (
        <FormField
          key={2}
          name="phone"
          autoComplete="tel"
          label={
            <Box direction="row">
              <Text>Phone Number</Text>
              <Text color="status-critical">*</Text>
            </Box>
          }
          required
          type="text"
          value={user.phoneNumber}
          onChange={(event) => checkPhoneValidation(event)}
          validate={[
            {
              regexp: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
            },
            (name) => {
              if (
                !name.match(
                  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
                )
              )
                return "Not a valid phone number";
              return undefined;
            },
          ]}
        />
      ) : (
        <>
          <FormField
            key={3}
            name="cardNumber"
            autoComplete="cc-number"
            label={
              <Box direction="row">
                <Text>Card</Text>
                <Text color="status-critical">*</Text>
              </Box>
            }
            required
            type="number"
            value={cardNumber}
            onChange={(event) => setCardNumber(event.target.value)}
            validate={[
              { regexp: cardnoMasterCard || cardnoVisa },
              (value) => {
                if (!value.match(cardnoMasterCard || cardnoVisa))
                  return "We only accept MasterCard or Visa";
                return undefined;
              },
            ]}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <FormField
              name="cc-exp"
              autoComplete="cc-exp"
              label={
                <Box direction="row">
                  <Text>Card Exp</Text>
                  <Text color="status-critical">*</Text>
                </Box>
              }
              placeholder="MM/YYYY"
              required
              type="text"
              value={""}
              onChange={(event) => setCardExp(event.target.value)}
              validate={[
                { regexp: /^(0?[1-9]|1[012])[/-](?:202[0-5])/ },
                (value) => {
                  if (!value.match(/^(0?[1-9]|1[012])[/-](?:202[0-5])/))
                    return "wrong format, MM/YYYY";
                  return undefined;
                },
              ]}
              style={{ width: "45%" }}
            />
            <FormField
              name="cardCVC"
              autoComplete="cc-csc"
              label={
                <Box direction="row">
                  <Text>Card CVC</Text>
                  <Text color="status-critical">*</Text>
                </Box>
              }
              required
              type="number"
              value={""}
              onChange={(event) => setCardCVC(event.target.value)}
              validate={[
                { regexp: /^\d{3}$/ },
                (value) => {
                  if (!value.match(/^\d{3}$/)) return "Must be 3 numbers";
                  return undefined;
                },
              ]}
              style={{ width: "45%" }}
            />
          </div>
        </>
      )}
    </Form>
  );
};

export default PaymentForm;
