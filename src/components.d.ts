/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface CarbonOffsetEstimator {
        /**
          * @default 303.40
         */
        "subTotal": number;
    }
}
declare global {
    interface HTMLCarbonOffsetEstimatorElement extends Components.CarbonOffsetEstimator, HTMLStencilElement {
    }
    var HTMLCarbonOffsetEstimatorElement: {
        prototype: HTMLCarbonOffsetEstimatorElement;
        new (): HTMLCarbonOffsetEstimatorElement;
    };
    interface HTMLElementTagNameMap {
        "carbon-offset-estimator": HTMLCarbonOffsetEstimatorElement;
    }
}
declare namespace LocalJSX {
    interface CarbonOffsetEstimator {
        /**
          * @default 303.40
         */
        "subTotal"?: number;
    }
    interface IntrinsicElements {
        "carbon-offset-estimator": CarbonOffsetEstimator;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "carbon-offset-estimator": LocalJSX.CarbonOffsetEstimator & JSXBase.HTMLAttributes<HTMLCarbonOffsetEstimatorElement>;
        }
    }
}
