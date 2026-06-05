# Graph Report - src  (2026-05-23)

## Corpus Check
- 367 files · ~88,795 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1291 nodes · 3125 edges · 95 communities (74 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 94|Community 94]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 153 edges
2. `Button` - 61 edges
3. `Card` - 47 edges
4. `getUser()` - 40 edges
5. `CardContent` - 40 edges
6. `CardHeader` - 31 edges
7. `CardTitle` - 29 edges
8. `CardDescription` - 21 edges
9. `Input` - 20 edges
10. `Separator()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `AppLayout()` --calls--> `getUser()`  [EXTRACTED]
  app/(pages)/(public)/(app)/layout.tsx → back/lib/auth-session.ts
- `PricingPlans()` --calls--> `cn()`  [EXTRACTED]
  app/(pages)/(public)/(website)/pricing/_components/PricingPlans.tsx → front/lib/utils.ts
- `POST()` --calls--> `getUser()`  [EXTRACTED]
  app/api/mapLocations/route.ts → back/lib/auth-session.ts
- `CommunityPage()` --calls--> `useRecentlyViewed`  [EXTRACTED]
  app/(pages)/(public)/(app)/community/page.tsx → front/stores/use-recently-viewed.store.ts
- `CommunityResourcesPage()` --calls--> `useUser()`  [EXTRACTED]
  app/(pages)/(public)/(app)/community/resources/page.tsx → front/context/UserContext.tsx

## Communities (95 total, 21 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (38): fetchTalents(), Talent, useAlert(), UseAlertOptions, useConfirm(), UseConfirmOptions, FiltersPanel(), LEVEL_OPTIONS (+30 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (12): formSchema, events, STATUS_VARIANT, CardContent, CardDescription, CardHeader, CardTitle, Field() (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (22): usePostState(), ThumbnailResult, useVideoThumbnail(), useViewportRecentlyViewed(), PostPageProps, ExpandableText(), ExpandableTextProps, AudioPlayer() (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (25): changePassword(), ChangePasswordInput, deleteSocialLink(), deleteUser(), fetchUserById(), fetchUserByUsername(), fetchUsers(), getFollowStatus() (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (6): steps, Problems, ProfileDelete(), useDeleteUser(), Button, ButtonProps

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (8): ResetPasswordOTP(), ResetPasswordOTPProps, VerifyEmailOTP(), VerifyEmailOTPProps, OtpType, sendAuthOtpEmail(), SendAuthOtpEmailParams, UsersService

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (21): ContactForm(), formSchema, FormValues, TYPE_LABELS, useCreateMail(), useUpsertSocialLink(), SelectContent, SelectItem (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (17): AccountShell(), AccountLayout(), metadata, AdminLayout(), unauthorized(), WebsiteLayout(), GET(), POST() (+9 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (21): createUserConfig(), deleteUserConfig(), fetchMyConfigs(), updateUserConfig(), UserConfig, AudiContent, AudiovisualConfigSection(), SECTIONS (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (18): LoginFormSchema, SignUpFormSchema, FeedbackDialogProps, FeedbackFormValues, schema, useChangePassword(), SecurityPassword(), FormControl() (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (19): createComment(), CreateCommentInput, createPost(), CreatePostInput, deletePost(), fetchCommentsByPostId(), fetchFollowedCategoryPosts(), fetchPostById() (+11 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (21): LoginForm(), LogOut(), ExploreBlock(), cn(), MarketplaceBlock(), DesktopNavbar(), MobileNavbar(), MobileNavbarProps (+13 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (17): buttonVariants, Calendar(), CalendarDayButton(), DatePicker(), DatePickerProps, formatDate(), DatePickerRange(), DatePickerWithRangeProps (+9 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (3): CommentsAction, FlatComment, CommentsService

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (19): useIsMobile(), SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle (+11 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (11): SignUpForm(), ForgotPasswordPage(), ApiErrorShape, OtpType, useEmailOtp(), useSendEmail(), OAuthNewUserContent(), ResetPasswordContent() (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (19): CreateCategoryForm(), CreateCategoryForm(), CreateCategoryFormProps, CreateCategorySchema, CreateCategoryValues, STEPS, useCreateCategory(), MultistepForm() (+11 more)

### Community 17 - "Community 17"
Cohesion: 0.17
Nodes (17): createResource(), createResourceComment(), CreateResourceCommentInput, CreateResourceInput, fetchResourceById(), fetchResourceComments(), fetchResources(), fetchResourcesByAuthor() (+9 more)

### Community 18 - "Community 18"
Cohesion: 0.19
Nodes (15): CommentRow(), CommentRoot(), CONFIG, MediaKind, MediaKitUploaderProps, useRequireAuth(), useCreateComment(), useVoteComment() (+7 more)

### Community 19 - "Community 19"
Cohesion: 0.19
Nodes (16): ProjectCard(), useShare(), timeAgo(), PostActions(), PostActionsProps, PostActionsPopup(), PostActionsPopupProps, useReportPost() (+8 more)

### Community 20 - "Community 20"
Cohesion: 0.16
Nodes (13): useCategories(), useResources(), CategoryResourcesPageClient(), CommunityResourcesPage(), BADGE_PALETTE, colorForSlug(), ResourceCard(), ResourceCardProps (+5 more)

### Community 21 - "Community 21"
Cohesion: 0.16
Nodes (11): CommunityPage(), PostsBlock(), creatorFeatures, freeFeatures, PricingCardProps, PricingPlans(), useFollowedCategoryPosts(), usePosts() (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.16
Nodes (14): MediaExpandOverlay(), MediaLightbox(), MediaLightboxProps, getDisplayName(), getInitialName(), AuthorFields, PostAvatar(), InfoBlock() (+6 more)

### Community 23 - "Community 23"
Cohesion: 0.16
Nodes (10): CategoryPageClient(), BreadcrumbOverride(), BreadcrumbOverrideProps, useBreadcrumbOverride(), useCategoryBySlug(), useFollowStatus(), usePostsByCategory(), useToggleFollowCategory() (+2 more)

### Community 26 - "Community 26"
Cohesion: 0.18
Nodes (12): buttons, stats, Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, Badge (+4 more)

### Community 27 - "Community 27"
Cohesion: 0.13
Nodes (9): MarketplaceCategoryPageClient(), ProjectsTab(), ProjectDetailPageClient(), ProjectPageProps, ProjectCardProps, REMUNERATION_LABEL, WORKMODE_LABEL, useProjectById() (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.15
Nodes (15): BreadcrumbAuto(), CATEGORY_BADGE_PALETTE, HIDDEN_SEGMENTS, PRIVATE_SECTIONS, SEGMENT_LABELS, BreadcrumbOverride, BreadcrumbOverridesStore, useBreadcrumbOverrides (+7 more)

### Community 29 - "Community 29"
Cohesion: 0.18
Nodes (13): NavMainItem, NavSubItem, NavPublic(), publicLinks, settingsItems, SidebarGroup, SidebarGroupLabel, SidebarMenu (+5 more)

### Community 30 - "Community 30"
Cohesion: 0.18
Nodes (13): Category, createCategory(), CreateCategoryInput, deleteCategory(), fetchCategories(), fetchCategoryById(), fetchCategoryBySlug(), fetchPostsByCategory() (+5 more)

### Community 31 - "Community 31"
Cohesion: 0.17
Nodes (11): ContactStatus, ContactType, createMail(), CreateMailInput, deleteMail(), fetchMailById(), fetchMails(), Mail (+3 more)

### Community 32 - "Community 32"
Cohesion: 0.16
Nodes (6): { POST, GET }, auth, authClient, otpExpiresIn, UsersAction, config

### Community 34 - "Community 34"
Cohesion: 0.18
Nodes (13): CreateDropdown(), CreateType, Header(), settingsItems, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel (+5 more)

### Community 35 - "Community 35"
Cohesion: 0.23
Nodes (8): AdminShell(), AppShell(), AppLayout(), UserContext, UserProvider(), AppSidebar(), SidebarInset, SidebarProvider

### Community 36 - "Community 36"
Cohesion: 0.14
Nodes (5): sections, features, creatorFeatures, PostWithAuthorAndCategory, Card

### Community 37 - "Community 37"
Cohesion: 0.19
Nodes (4): globalForPrisma, FeedbackAction, PostsAction, FeedbackService

### Community 38 - "Community 38"
Cohesion: 0.23
Nodes (10): createProject(), createProjectComment(), CreateProjectCommentInput, CreateProjectInput, fetchProjectById(), fetchProjectComments(), fetchProjects(), PROJECT_ROOT (+2 more)

### Community 39 - "Community 39"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 40 - "Community 40"
Cohesion: 0.19
Nodes (4): ProjectsAction, ProjectWriteData, CreateProjectInput, ProjectsService

### Community 43 - "Community 43"
Cohesion: 0.17
Nodes (11): CreateProjectForm(), CreateProjectFormProps, CreateProjectSchema, CreateProjectValues, LEVEL_OPTIONS, PROJECT_TYPES, REMUNERATION_OPTIONS, STEPS (+3 more)

### Community 44 - "Community 44"
Cohesion: 0.26
Nodes (5): faqs, faqs, AccordionContent, AccordionItem, AccordionTrigger

### Community 45 - "Community 45"
Cohesion: 0.23
Nodes (10): navMain, NavProjects(), projects, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuAction (+2 more)

### Community 46 - "Community 46"
Cohesion: 0.26
Nodes (5): PostImageSkeleton(), useSavedPosts(), useSavedResources(), SavedPage(), Skeleton()

### Community 47 - "Community 47"
Cohesion: 0.18
Nodes (10): FieldContent(), FieldError(), FieldGroup(), FieldLegend(), FieldSeparator(), FieldSet(), FieldTitle(), fieldVariants (+2 more)

### Community 48 - "Community 48"
Cohesion: 0.20
Nodes (9): baseSchema, CreateResourceForm(), CreateResourceFormProps, CreateResourceSchema, CreateResourceValues, RESOURCE_TYPE_LABELS, STEPS, uploadToImageKit() (+1 more)

### Community 53 - "Community 53"
Cohesion: 0.24
Nodes (3): POST(), MapLocationsAction, MapLocationsService

### Community 55 - "Community 55"
Cohesion: 0.27
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

### Community 56 - "Community 56"
Cohesion: 0.20
Nodes (10): CONTENT_CONFIG, CONTENT_TYPES, ContentConfig, ContentType, CreatePostForm(), CreatePostFormProps, CreatePostSchema, CreatePostValues (+2 more)

### Community 57 - "Community 57"
Cohesion: 0.29
Nodes (7): VerifyEmailChangeModal(), VerifyEmailChangeModalProps, useVerifyEmailChange(), VerifyEmailChangeSchema, VerifyEmailChangeValues, UpdateProfileFormValues, UpdateProfileSchema

### Community 59 - "Community 59"
Cohesion: 0.31
Nodes (4): usePostsByAuthor(), useResourcesByAuthor(), useUserByUsername(), UserProfilePageClient()

### Community 60 - "Community 60"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 61 - "Community 61"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 62 - "Community 62"
Cohesion: 0.36
Nodes (6): CommentItem(), Comments(), CommentsProps, useCommentsByPostId(), useProjectComments(), useResourceComments()

### Community 63 - "Community 63"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 64 - "Community 64"
Cohesion: 0.43
Nodes (4): EmailChangeConfirmation(), sendEmailChangeConfirmation(), SendEmailChangeConfirmationParams, POST()

### Community 65 - "Community 65"
Cohesion: 0.33
Nodes (5): formatCount(), RecentlyViewedItem(), RecentlyViewedProps, RecentlyViewedSkeleton(), RecentlyViewedEntry

### Community 66 - "Community 66"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, metadata, QueryProvider()

### Community 67 - "Community 67"
Cohesion: 0.53
Nodes (4): useUser(), ToggleDarkMode(), HeaderPublic(), NavUser()

### Community 70 - "Community 70"
Cohesion: 0.47
Nodes (4): createFeedback(), CreateFeedbackInput, FeedbackDialog(), useCreateFeedback()

### Community 73 - "Community 73"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

## Knowledge Gaps
- **259 isolated node(s):** `config`, `geistSans`, `geistMono`, `metadata`, `PostPageProps` (+254 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 11` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 9`, `Community 12`, `Community 14`, `Community 15`, `Community 16`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 26`, `Community 28`, `Community 34`, `Community 35`, `Community 36`, `Community 39`, `Community 44`, `Community 45`, `Community 46`, `Community 47`, `Community 55`, `Community 56`, `Community 60`, `Community 61`, `Community 63`, `Community 67`, `Community 68`, `Community 69`, `Community 72`, `Community 73`, `Community 74`?**
  _High betweenness centrality (0.237) - this node is a cross-community bridge._
- **Why does `getUser()` connect `Community 7` to `Community 64`, `Community 33`, `Community 35`, `Community 37`, `Community 5`, `Community 40`, `Community 41`, `Community 42`, `Community 13`, `Community 49`, `Community 50`, `Community 51`, `Community 52`, `Community 53`, `Community 54`, `Community 24`, `Community 25`, `Community 58`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Why does `Button` connect `Community 4` to `Community 0`, `Community 1`, `Community 2`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 12`, `Community 14`, `Community 15`, `Community 16`, `Community 21`, `Community 22`, `Community 23`, `Community 26`, `Community 27`, `Community 34`, `Community 39`, `Community 43`, `Community 55`, `Community 57`, `Community 59`, `Community 65`, `Community 67`, `Community 68`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `config`, `geistSans`, `geistMono` to the rest of the system?**
  _259 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06170598911070781 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1408199643493761 - nodes in this community are weakly interconnected._