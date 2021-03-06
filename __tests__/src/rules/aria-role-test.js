/* eslint-env jest */
/**
 * @fileoverview Enforce aria role attribute is valid.
 * @author Ethan Cohen
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import assign from 'object-assign';
import parserOptionsMapper from '../../__util__/parserOptionsMapper';
import rule from '../../../src/rules/aria-role';
import ROLES from '../../../src/util/attributes/role.json';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();

const errorMessage = {
  message: 'Elements with ARIA roles must use a valid, non-abstract ARIA role.',
  type: 'JSXAttribute',
};

const validRoles = Object.keys(ROLES).filter(role => ROLES[role].abstract === false);
const invalidRoles = Object.keys(ROLES).filter(role => ROLES[role].abstract === true);

const createTests = roles => roles.map(role => ({
  code: `<div role="${role.toLowerCase()}" />`,
}));

const validTests = createTests(validRoles);
const invalidTests = createTests(invalidRoles).map((test) => {
  const invalidTest = assign({}, test);
  invalidTest.errors = [errorMessage];
  return invalidTest;
});

ruleTester.run('aria-role', rule, {
  valid: [
    // Variables should pass, as we are only testing literals.
    { code: '<div />' },
    { code: '<div></div>' },
    { code: '<div role={role} />' },
    { code: '<div role={role || "button"} />' },
    { code: '<div role={role || "foobar"} />' },
    { code: '<div role="tabpanel row" />' },
    { code: '<div role="switch" />' },
    { code: '<div role="doc-abstract" />' },
    { code: '<div role="doc-appendix doc-bibliography" />' },
    { code: '<Bar baz />' },
  ].concat(validTests).map(parserOptionsMapper),

  invalid: [
    { code: '<div role="foobar" />', errors: [errorMessage] },
    { code: '<div role="datepicker"></div>', errors: [errorMessage] },
    { code: '<div role="range"></div>', errors: [errorMessage] },
    { code: '<div role=""></div>', errors: [errorMessage] },
    { code: '<div role="tabpanel row foobar"></div>', errors: [errorMessage] },
    { code: '<div role="tabpanel row range"></div>', errors: [errorMessage] },
    { code: '<div role="doc-endnotes range"></div>', errors: [errorMessage] },
    { code: '<div role />', errors: [errorMessage] },
    { code: '<div role={null}></div>', errors: [errorMessage] },
  ].concat(invalidTests).map(parserOptionsMapper),
});
