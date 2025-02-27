import { PropsWithChildren, useLayoutEffect } from "react";
import { useGridStackContext } from "./grid-stack-context";
import {
  GridItemHTMLElement,
  GridStack,
  GridStackNode,
  Utils,
} from "gridstack";
import { DDElementHost } from "gridstack/dist/dd-element";
import { useGridStackItemContext } from "./grid-stack-item-context";
import { useGridStackRenderContext } from "./grid-stack-render-context";

export type GridStackHandleReInitializerProps = PropsWithChildren;

/**
 * @experimental
 * This is a temporary solution to reinitialize the handle for the grid stack item.
 */
export function GridStackHandleReInitializer(
  props: GridStackHandleReInitializerProps
) {
  const {
    _gridStack: { value: gridStack },
  } = useGridStackContext();
  const { id: widgetId } = useGridStackItemContext();
  const { getWidgetContainer } = useGridStackRenderContext();

  useLayoutEffect(() => {
    if (gridStack) {
      const widgetContainer = getWidgetContainer(widgetId);
      if (widgetContainer) {
        const element = Utils.getElement(
          widgetContainer.parentElement!
        ) as GridItemHTMLElement & DDElementHost;
        const rawNode = element.gridstackNode;
        const ddElement = element.ddElement;
        if (rawNode && ddElement) {
          // https://github.com/gridstack/gridstack.js/blob/a917afcada4bd2892963678c8b1bde7630bb9528/src/gridstack.ts#L2417
          const node = rawNode as GridStackNode & { _initDD: boolean };
          node._initDD = false;

          ddElement.cleanDraggable();
          ddElement.cleanDroppable();

          // https://github.com/gridstack/gridstack.js/blob/a917afcada4bd2892963678c8b1bde7630bb9528/src/gridstack.ts#L2402
          const g = gridStack as GridStack & {
            _prepareDragDropByNode: (node: GridStackNode) => void;
          };
          g._prepareDragDropByNode(node);
        }
      }
    }
  }, [getWidgetContainer, gridStack, widgetId]);

  return <>{props.children}</>;
}
