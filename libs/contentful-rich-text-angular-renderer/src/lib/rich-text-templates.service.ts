import { computed, Injectable, signal, TemplateRef } from '@angular/core';
import { NodeContext, TemplateMap } from './types';

type TemplateRegistration = {
  templateRef: TemplateRef<NodeContext>;
  isDefault: boolean;
};

// Provided by each CfRichTextDocumentComponent, so custom templates don't leak between documents
// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export class CfRichTextTemplatesService {
  // every registered template per type, in registration order
  private readonly registrations = signal<
    Readonly<Record<string, readonly TemplateRegistration[]>>
  >({});

  // the last custom template wins, otherwise the first default one
  readonly templates = computed<TemplateMap>(
    () => {
      const templates: TemplateMap = {};
      Object.entries(this.registrations()).forEach(([type, registrations]) => {
        // replay the registrations: a default never replaces an existing template
        const active = registrations.reduce<TemplateRegistration | undefined>(
          (current, registration) =>
            !registration.isDefault || current == null ? registration : current,
          undefined,
        );
        if (active) {
          templates[type] = active.templateRef;
        }
      });
      return templates;
    },
    { equal: haveSameTemplates },
  );

  addTemplate(
    // node type or mark type
    type: string,
    templateRef: TemplateRef<NodeContext>,
    isDefault: boolean,
  ): void {
    this.registrations.update(registrations => ({
      ...registrations,
      [type]: [...(registrations[type] ?? []), { templateRef, isDefault }],
    }));
  }

  removeTemplate(type: string, templateRef: TemplateRef<NodeContext>): void {
    this.registrations.update(registrations => ({
      ...registrations,
      [type]: (registrations[type] ?? []).filter(
        registration => registration.templateRef !== templateRef,
      ),
    }));
  }
}

function haveSameTemplates(a: TemplateMap, b: TemplateMap): boolean {
  const aTypes = Object.keys(a);
  return (
    aTypes.length === Object.keys(b).length &&
    aTypes.every(type => a[type] === b[type])
  );
}
