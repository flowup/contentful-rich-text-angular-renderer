import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { AppComponent } from './app.component';

const CUSTOM_TEMPLATE_SELECTORS = ['figure', 'pre code.hljs', '.blog-post'];

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let element: HTMLElement;

  const query = (selector: string): HTMLElement => {
    const result = element.querySelector<HTMLElement>(selector);
    if (!result) {
      throw new Error(`No element matches ${selector}`);
    }
    return result;
  };

  const defaultPreview = () => query('demo-default-rich-text');
  const customPreview = () => query('demo-custom-rich-text');

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(AppComponent);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('renders the sample document in both previews', () => {
    [defaultPreview(), customPreview()].forEach(preview => {
      expect(preview.querySelector('h1')?.textContent).toContain(
        'Heading - level 1',
      );
      expect(preview.querySelector('h2')?.textContent).toContain(
        'Heading - level 2',
      );
      expect(preview.querySelector('a')?.textContent).toContain('hyperlinks');
      expect(preview.querySelectorAll('li')).toHaveLength(5);
    });
  });

  it('uses custom templates only in the custom preview', () => {
    CUSTOM_TEMPLATE_SELECTORS.forEach(selector => {
      expect(defaultPreview().querySelector(selector)).toBeNull();
      expect(customPreview().querySelector(selector)).not.toBeNull();
    });
  });

  it('updates both previews after editing the JSON', async () => {
    await userEvent.click(query('.jsoneditor-expand-all'));
    const headingValue = [
      ...element.querySelectorAll<HTMLElement>('.jsoneditor-value'),
    ].find(value => value.textContent === 'Heading - level 1');
    if (!headingValue) {
      throw new Error('Heading value not found in the JSON editor');
    }

    await userEvent.fill(headingValue, 'Edited heading');
    await userEvent.tab();

    await expect
      .poll(() => defaultPreview().querySelector('h1')?.textContent)
      .toContain('Edited heading');
    expect(customPreview().querySelector('h1')?.textContent).toContain(
      'Edited heading',
    );
  });

  it('loads every image', async () => {
    const images = [...element.querySelectorAll('img')];
    expect(images.length).toBeGreaterThan(0);

    // Optimized images are lazy-loaded, so bring each one into view in turn
    // eslint-disable-next-line functional/no-loop-statements
    for (const image of images) {
      image.scrollIntoView();
      await expect
        .poll(() => image.complete && image.naturalWidth > 0, {
          timeout: 10_000,
        })
        .toBe(true);
    }
  });
});
