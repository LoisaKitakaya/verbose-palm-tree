import { Title } from "@solidjs/meta";

export default function MetaTitle(props) {
  return (
    <>
      <Title>{props.title} | Uranium Glass</Title>
    </>
  );
}
