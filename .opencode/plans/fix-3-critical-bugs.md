# Fix 3 Critical Bugs

## Fix 1: ROLE_ prefix mismatch

**File:** `code/backend/src/main/kotlin/pucmg/ps/backend/auth/user/UserController.kt`

4 changes — replace `hasAuthority('ADMIN')` with `hasRole('ADMIN')`:

| Line | Current | Fix |
|------|---------|-----|
| 17 | `@PreAuthorize("hasAuthority('ADMIN')")` | `@PreAuthorize("hasRole('ADMIN')")` |
| 22 | `@PreAuthorize("hasAuthority('ADMIN')")` | `@PreAuthorize("hasRole('ADMIN')")` |
| 26 | `@PreAuthorize("hasAuthority('ADMIN') or @userSecurity.isSelf(...)")` | `@PreAuthorize("hasRole('ADMIN') or @userSecurity.isSelf(...)")` |
| 35 | `@PreAuthorize("hasAuthority('ADMIN')")` | `@PreAuthorize("hasRole('ADMIN')")` |

**Why:** `CustomUserDetailsService.kt:21` grants `SimpleGrantedAuthority("ROLE_ADMIN")` (with `ROLE_` prefix). `hasAuthority('ADMIN')` checks for exact string `ADMIN` — never matches. `hasRole('ADMIN')` adds `ROLE_` prefix automatically, matching the granted authority. Comment on line 19 confirms intent was `hasRole`.

---

## Fix 2: Jackson version conflict

**File:** `code/backend/build.gradle.kts`

Three changes:

1. **Line 32 — Remove duplicate webmvc:**
   ```diff
   - implementation("org.springframework.boot:spring-boot-starter-webmvc")
   ```
   Already pulled transitively by `spring-boot-starter-web` (line 48).

2. **Lines 39-40 — Replace Jackson 3.x with Spring-managed 2.x:**
   ```diff
   - implementation("com.fasterxml.jackson.core:jackson-core")
   - implementation("tools.jackson.module:jackson-module-kotlin:3.1.0")
   + implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
   ```
   - `jackson-core` is redundant (managed by Spring BOM, in web starter transitively)
   - `tools.jackson.module:jackson-module-kotlin:3.1.0` is **Jackson 3.x** — conflicts with `jackson-core` 2.x and `jjwt-jackson` 2.x
   - `com.fasterxml.jackson.module:jackson-module-kotlin` is **Jackson 2.x**, managed by Spring Boot BOM (no version needed)

---

## Fix 3: CupomService missing `@Transactional` on write methods

**File:** `code/backend/src/main/kotlin/pucmg/ps/backend/Cupom/CupomService.kt`

Class-level `@Transactional(readOnly = true)` (line 19) makes all methods read-only unless overridden. Two methods write to DB without override:

1. **`usarCupom()` (line 132):** calls `cupom.usar()` + `cupomDAO.save(cupom)` — add `@Transactional`
2. **`deletar()` (line 177):** calls `cupomDAO.deletarPorId(id)` — add `@Transactional`

```diff
+   @Transactional
    fun usarCupom(codigo: String): CupomResgatoDTO {

+   @Transactional
    fun deletar(id: Long) {
```
