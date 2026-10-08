const { capitalizeWords, filterActiveUsers, logAction } = require('../index');

describe('capitalizeWords', () => {
    test('capitalizes the first letter of each word', () => {
        expect(capitalizeWords('hello world')).toBe('Hello World');
    });

    test('leaves already capitalized words unchanged', () => {
        expect(capitalizeWords('Hello World')).toBe('Hello World');
    });

    test('capitalizes a single word', () => {
        expect(capitalizeWords('javascript')).toBe('Javascript');
    });

    test('returns an empty string when given an empty string', () => {
        expect(capitalizeWords('')).toBe('');
    });

    test('does not change the rest of each word', () => {
        expect(capitalizeWords('jEST iS fun')).toBe('JEST IS Fun');
    });

    test('handles multiple spaces between words', () => {
        expect(capitalizeWords('hello   world')).toBe('Hello   World');
    });

    test('keeps non-letter characters and capitalizes after them', () => {
        expect(capitalizeWords('well-known fact')).toBe('Well-Known Fact');
    });

    test('throws when input is not a string', () => {
        expect(() => capitalizeWords(null)).toThrow(TypeError);
    });
});

describe('filterActiveUsers', () => {
    const users = [
        { name: 'Alice', isActive: true },
        { name: 'Bob', isActive: false },
        { name: 'Carol', isActive: true },
    ];

    test('returns only active users', () => {
        expect(filterActiveUsers(users)).toEqual([
            { name: 'Alice', isActive: true },
            { name: 'Carol', isActive: true },
        ]);
    });

    test('returns an empty array when no users are active', () => {
        const inactive = [{ name: 'Bob', isActive: false }];
        expect(filterActiveUsers(inactive)).toEqual([]);
    });

    test('returns an empty array for an empty input array', () => {
        expect(filterActiveUsers([])).toEqual([]);
    });

    test('returns all users when every user is active', () => {
        const allActive = [
            { name: 'Alice', isActive: true },
            { name: 'Dan', isActive: true },
        ];
        expect(filterActiveUsers(allActive)).toHaveLength(2);
    });

    test('does not mutate the original array', () => {
        const copy = JSON.parse(JSON.stringify(users));
        filterActiveUsers(users);
        expect(users).toEqual(copy);
    });

    test('treats users missing isActive as inactive', () => {
        expect(filterActiveUsers([{ name: 'Eve' }])).toEqual([]);
    });
});

describe('logAction', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2025-01-15T10:30:00.000Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('returns a message with username, action and timestamp', () => {
        expect(logAction('login', 'Alice')).toBe(
            'User Alice performed login at 2025-01-15T10:30:00.000Z'
        );
    });

    test('includes the username in the message', () => {
        expect(logAction('logout', 'Bob')).toContain('Bob');
    });

    test('includes the action in the message', () => {
        expect(logAction('upload', 'Carol')).toContain('upload');
    });

    test('includes an ISO 8601 timestamp', () => {
        expect(logAction('login', 'Alice')).toMatch(
            /at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        );
    });
});
