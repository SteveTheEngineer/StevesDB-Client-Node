export enum ComparatorOperation {
    /**
     * a == b
     */
    EQUAL_TO,
    /**
     * a != b
     */
    NOT_EQUAL_TO,
    /**
     * a.toLowerCase() == b.toLowerCase()
     */
    EQUAL_TO_IGNORE_CASE,
    /**
     * a.toLowerCase() != b.toLowerCase()
     */
    NOT_EQUAL_TO_IGNORE_CASE,
    /**
     * a > b
     */
    GREATER_THAN,
    /**
     * a < b
     */
    LESS_THAN,
    /**
     * a >= b
     */
    GREATER_THAN_OR_EQUAL_TO,
    /**
     * a <= b
     */
    LESS_THAN_OR_EQUAL_TO,
    /**
     * a.startsWith(b)
     */
    STARTS_WITH,
    /**
     * a.endsWith(b)
     */
    ENDS_WITH,
    /**
     * a.toLowerCase().startsWith(b.toLowerCase())
     */
    STARTS_WITH_IGNORE_CASE,
    /**
     * a.toLowerCase().endsWith(b.toLowerCase())
     */
    ENDS_WITH_IGNORE_CASE,
    /**
     * !a.startsWith(b)
     */
    DOES_NOT_START_WITH,
    /**
     * !a.endsWith(b)
     */
    DOES_NOT_END_WITH,
    /**
     * !a.toLowerCase().startsWith(b.toLowerCase())
     */
    DOES_NOT_START_WITH_IGNORE_CASE,
    /**
     * !a.toLowerCase().endsWith(b.toLowerCase())
     */
    DOES_NOT_END_WITH_IGNORE_CASE,
    /**
     * a.includes(b)
     */
    CONTAINS,
    /**
     * !a.includes(b)
     */
    DOES_NOT_CONTAIN,
    /**
     * a.toLowerCase().includes(b.toLowerCase())
     */
    CONTAINS_IGNORE_CASE,
    /**
     * !a.toLowerCase().includes(b.toLowerCase())
     */
    DOES_NOT_CONTAIN_IGNORE_CASE,
    /**
     * b.test(a)
     */
    MATCHES_REGEXP,
    /**
     * !b.test(a)
     */
    DOES_NOT_MATCH_REGEXP,
    /**
     * a.length == b
     */
    LENGTH_EQUAL_TO,
    /**
     * a.length != b
     */
    LENGTH_NOT_EQUAL_TO,
    /**
     * a.length > b
     */
    LENGTH_GREATER_THAN,
    /**
     * a.length < b
     */
    LENGTH_LESS_THAN,
    /**
     * a.length >= b
     */
    LENGTH_GREATER_THAN_OR_EQUAL_NO,
    /**
     * a.length <= b
     */
    LENGTH_LESS_THAN_OR_EQUAL_TO
}