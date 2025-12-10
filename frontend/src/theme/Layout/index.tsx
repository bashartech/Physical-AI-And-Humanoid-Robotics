import React, {type ReactNode, useEffect, useState} from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {useKeyboardNavigation} from '@docusaurus/theme-common/internal';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProvider from '@theme/Layout/Provider';
import ErrorPageContent from '@theme/ErrorPageContent';
import type {Props} from '@theme/Layout';
import styles from './styles.module.css';
import SelectionPopup from '../../components/SelectionPopup'; // Import SelectionPopup
import ChatWidget from '../../components/ChatWidget';
import { Toaster } from "../../components/ui/sonner"

export default function Layout(props: Props): ReactNode {
  const {
    children,
    noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props;
const [initialQuestion, setInitialQuestion] = useState("");


  useKeyboardNavigation();

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      // Check if it's an anchor link and its href starts with current path + #
      // or just # for internal page anchors
      if (
        target.tagName === 'A' &&
        target.hash &&
        target.pathname === window.location.pathname
      ) {
        const id = target.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          event.preventDefault();
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          // Update URL hash without triggering a full page reload
          window.history.pushState(null, '', target.hash);
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  const handleSelectionText = (text: string) => {
    console.log('Selected text:', text);
    setInitialQuestion(text);
    // This will be properly handled by ChatWidget in T036
  };

  return (
    <LayoutProvider>
      <PageMetadata title={title} description={description} />

      <SkipToContent />

      <AnnouncementBar />

      <Navbar />

      <SelectionPopup onSelectText={handleSelectionText} /> {/* Render SelectionPopup */}
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
  );
}
