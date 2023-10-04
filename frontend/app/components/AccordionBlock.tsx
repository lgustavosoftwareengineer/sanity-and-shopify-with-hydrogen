import {PortableText, PortableTextComponentProps} from '@portabletext/react';
import {TypedObject} from '@portabletext/types';

type Value = {
  _type: 'module.accordion';
  _key?: string;
  groups?: (TypedObject & {
    title?: string;
    body?: TypedObject[];
  })[];
};

export function AccordionBlock(props: PortableTextComponentProps<Value>) {
  if (!props?.value?.groups?.length) {
    return null;
  }

  return (
    <div className="flex flex-col bg-blue-50 divide-y divide-blue-100">
      {props.value.groups.map((group) => (
        <details key={group._key} className="p-6">
          <summary>{group.title}</summary>
          {group.body && group.body?.length > 0 ? (
            <PortableText value={group.body} />
          ) : null}
        </details>
      ))}
    </div>
  );
}
