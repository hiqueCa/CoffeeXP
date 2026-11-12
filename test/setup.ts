/**
 * Following the example from https://tanstack.com/router/latest/docs/how-to/setup-testing#3-create-test-setup
 */

import "@testing-library/jest-dom/vitest";

// @ts-expect-error
global.IS_REACT_ACT_ENVIRONMENT = true;
