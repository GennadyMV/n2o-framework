import React from "react";
import Nav from "reactstrap/lib/Nav";
import NavbarBrand from "reactstrap/lib/NavbarBrand";
import Navbar from "reactstrap/lib/Navbar";
import NavItem from "reactstrap/lib/NavItem";
import NavLink from "reactstrap/lib/NavLink";
import Button from "reactstrap/lib/Button";
import Icon from "n2o-framework/lib/components/snippets/Icon/Icon";

import Notifications from "../../src/Notifications";
import Counter from "../../src/Counter";

export default function AppTemplate({ children }) {
  return (
    <div className="application">
      <Navbar color="secondary" light>
        <NavbarBrand href="/">NavbarWithCounters</NavbarBrand>
        <Nav>
          <NavItem>
            <NavLink href="/components/">
              <Counter bind="testCounterId">
                <Button color="secondary" size="sm">
                  <Icon name="fa fa-bell" />
                </Button>
              </Counter>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/components/">
              <Counter bind="testCounterId" showZero>
                <Button color="secondary" size="sm">
                  <Icon name="fa fa-bell" />
                </Button>
              </Counter>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/components/">
              <Counter bind="testCounterId" color="success">
                <Button color="secondary" size="sm">
                  <Icon name="fa fa-bell" />
                </Button>
              </Counter>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/components/">
              <Counter bind="testCounterId" overflowCount={9}>
                <Button color="secondary" size="sm">
                  <Icon name="fa fa-bell" />
                </Button>
              </Counter>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/components/">
              <Counter bind="testCounterId" overflowText="...">
                <Button color="secondary" size="sm">
                  <Icon name="fa fa-bell" />
                </Button>
              </Counter>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/components/">
              <Counter bind="testCounterId" noNumber>
                <Button color="secondary" size="sm">
                  <Icon name="fa fa-bell" />
                </Button>
              </Counter>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink href="/components/">
              <Counter>
                <Button color="secondary" size="sm">
                  <Icon name="fa fa-bell" />
                </Button>
              </Counter>
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <div className="application-body container-fluid">{children}</div>
      <Notifications />
    </div>
  );
}
