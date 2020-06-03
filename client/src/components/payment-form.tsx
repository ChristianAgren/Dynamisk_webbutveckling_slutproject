import React, { useContext } from "react";

import { Form, RadioButtonGroup } from "grommet";

import FormFieldLabel from "./form-field-label";

import AuthenticationContext from "../contexts/authentication-context/context";
import CartContext from "../contexts/cart-context/context";
import { PaymentMethod } from "../contexts/cart-context/context-provider";

interface IProps {}

const PaymentForm = (props: IProps) => {
  const { user, updateUser } = useContext(AuthenticationContext);
  const { paymentMethod, setPaymentMethod } = useContext(CartContext);

  return (
    <Form style={{ gridArea: "name" }}>
      <RadioButtonGroup
        margin={{ vertical: "medium" }}
        direction="row"
        name="radio"
        options={[
          { label: "Card", value: "card" },
          { label: "Swish", value: "swish" },
          { label: "Invoice", value: "invoice" },
        ]}
        value={paymentMethod}
        onChange={(event) =>
          setPaymentMethod(event.target.value as PaymentMethod)
        }
        {...props}
      />
      {paymentMethod === "invoice" ? (
        <FormFieldLabel
          key={1}
          name="email"
          label="Email"
          required
          type="email"
          value={user.email}
        />
      ) : paymentMethod === "swish" ? (
        <FormFieldLabel
          key={2}
          name="phoneNumber"
          label="Phone number"
          required
          type="number"
          value={user.phoneNumber}
        />
      ) : (
        <FormFieldLabel
          key={3}
          name="card"
          label="Card"
          required
          type="number"
          value={"12938120931283091"}
          onChange={(e) => updateUser("card", e.target.value)}
        />
      )}
    </Form>
  );
};

export default PaymentForm;
