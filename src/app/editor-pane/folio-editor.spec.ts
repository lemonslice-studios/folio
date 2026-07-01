import { describe, it, expect } from 'vitest';
import { isValidUrl, isImageUrl } from './folio-editor';

describe('folio-editor helpers', () => {
  describe('isValidUrl', () => {
    it('should validate typical web URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path?query=1')).toBe(true);
      expect(isValidUrl('file:///home/user/pic.png')).toBe(true);
    });

    it('should reject non-URL text', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('hello world')).toBe(false);
    });
  });

  describe('isImageUrl', () => {
    it('should detect known image formats from extensions', () => {
      expect(isImageUrl('https://example.com/image.png')).toBe(true);
      expect(isImageUrl('https://example.com/image.JPEG')).toBe(true);
      expect(isImageUrl('https://example.com/image.gif?sz=200')).toBe(true);
      expect(isImageUrl('http://example.com/image.webp#main')).toBe(true);
    });

    it('should detect data URL images', () => {
      expect(isImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA')).toBe(true);
    });

    it('should return false for non-image URLs', () => {
      expect(isImageUrl('https://example.com/index.html')).toBe(false);
      expect(isImageUrl('https://example.com/path/')).toBe(false);
    });
  });
});
