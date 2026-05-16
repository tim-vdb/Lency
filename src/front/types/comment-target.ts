export type CommentTarget =
    | { type: "post"; id: string }
    | { type: "resource"; id: string };
