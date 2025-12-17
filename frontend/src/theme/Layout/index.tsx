
import React, { type ReactNode, useEffect, useState } from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import { useKeyboardNavigation } from '@docusaurus/theme-common/internal';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProvider from '@theme/Layout/Provider';
import ErrorPageContent from '@theme/ErrorPageContent';
import type { Props } from '@theme/Layout';
import styles from './styles.module.css';

import SelectionPopup from '../../components/SelectionPopup';
import ChatWidget from '../../components/ChatWidget';
import { Toaster } from "../../components/ui/sonner";
import { AuthProvider } from '../../context/AuthContext';

export default function Layout(props: Props): ReactNode {
  const { children, noFooter, wrapperClassName, title, description } = props;
  const [initialQuestion, setInitialQuestion] = useState("");

  useKeyboardNavigation();

  return (
    <AuthProvider>
      <LayoutProvider>
        <PageMetadata title={title} description={description} />
        <SkipToContent />
        <AnnouncementBar />
        <Navbar />

        <SelectionPopup onSelectText={setInitialQuestion} />
        <ChatWidget initialSelectedText={initialQuestion} />
        <Toaster />

        <div
          id={SkipToContentFallbackId}
          className={clsx(
            ThemeClassNames.layout.main.container,
            ThemeClassNames.wrapper.main,
            styles.mainWrapper,
            wrapperClassName,
          )}>
          <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
            {children}
          </ErrorBoundary>
        </div>

        {!noFooter && <Footer />}
      </LayoutProvider>
    </AuthProvider>
  );
}
