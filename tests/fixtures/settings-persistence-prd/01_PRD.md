# PRD: Settings Persistence

## Background

Users set preferences in the settings panel but lose them on page reload. This breaks the basic expectation that "what I save stays saved."

## Problem

Toggles in the settings page reset to default after refresh because nothing is persisted client-side.

## Goals

- Persist all toggle state in localStorage on change
- Restore toggle state on page load
- Clearing browser storage returns toggles to default

## Non-goals

- Server-side persistence
- Encryption of stored values
- Cross-device sync

## User Scenarios

1. User opens settings, toggles "Dark mode" on, refreshes page. Dark mode stays on.
2. User clears browser storage. Settings revert to all default.

## Acceptance Criteria

- [ ] After toggling "Dark mode" and refreshing, the toggle remains in the same position
- [ ] After toggling 3 different settings and refreshing, all 3 retain their values
- [ ] Clearing localStorage resets all toggles to default state
- [ ] No settings other than the user-toggled ones are affected

## Open Questions

- Should there be a "Reset to defaults" button?
