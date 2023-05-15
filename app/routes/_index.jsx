import Landing from "~/components/landing";
import Menu from "~/components/menu";
import Store from "~/components/store";

export function meta() {
    return [
      {title: 'Hydrogen'},
      {description: 'A custom storefront powered by Hydrogen'},
    ];
  }
  export default function Index() {
    return (
      <div>
        <Menu />
        <Landing />
        <Store />
      </div>
    );
  }