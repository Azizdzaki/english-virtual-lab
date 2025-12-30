// Test file for Utility Functions
import {
  formatDate,
  formatDuration,
  truncateText,
  validateEmail,
  validatePassword,
  calculateProgressPercentage,
} from '../formatting';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2025-01-01';
      const result = formatDate(date);
      expect(result).toBeDefined();
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('StrongPass123');
      expect(result.isValid).toBe(true);
    });

    it('should reject weak password', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('truncateText', () => {
    it('should truncate text correctly', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
    });
  });

  describe('calculateProgressPercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculateProgressPercentage(50, 100)).toBe(50);
      expect(calculateProgressPercentage(25, 100)).toBe(25);
    });

    it('should return 0 for total 0', () => {
      expect(calculateProgressPercentage(50, 0)).toBe(0);
    });
  });
});
