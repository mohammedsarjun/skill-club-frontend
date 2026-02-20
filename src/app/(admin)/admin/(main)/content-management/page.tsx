"use client";

import { useState, useEffect, useCallback } from "react";
import AdminActionApi from "@/api/action/AdminActionApi";
import { IContentItem } from "@/types/interfaces/IContent";
import ContentHeader from "./components/ContentHeader";
import ContentList from "./components/ContentList";
import ContentEditor from "./components/ContentEditor";

export default function ContentManagementPage() {
  const [pages, setPages] = useState<IContentItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchContents = useCallback(async () => {
    setLoading(true);
    const response = await AdminActionApi.getAllContents();
    if (response.success && response.data) {
      setPages(response.data.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const selectedPage = pages.find((p) => p.slug === selectedSlug);

  const handleSelect = (slug: string) => {
    setSelectedSlug(slug);
    setSaved(false);
  };

  const handleContentChange = (text: string) => {
    setPages((prev) =>
      prev.map((p) => (p.slug === selectedSlug ? { ...p, content: text } : p))
    );
    setSaved(false);
  };

  const handleTitleChange = (text: string) => {
    setPages((prev) =>
      prev.map((p) => (p.slug === selectedSlug ? { ...p, title: text } : p))
    );
    setSaved(false);
  };

  const handleTogglePublish = () => {
    setPages((prev) =>
      prev.map((p) =>
        p.slug === selectedSlug ? { ...p, isPublished: !p.isPublished } : p
      )
    );
    setSaved(false);
  };

  const handleSave = async () => {
    if (!selectedPage) return;
    setSaving(true);
    const response = await AdminActionApi.updateContent(selectedPage.slug, {
      slug: selectedPage.slug,
      title: selectedPage.title,
      content: selectedPage.content,
      icon: selectedPage.icon,
      isPublished: selectedPage.isPublished,
    });
    if (response.success && response.data) {
      setPages((prev) =>
        prev.map((p) =>
          p.slug === selectedSlug ? { ...response.data!, ...{ slug: p.slug } } : p
        )
      );
    }
    setSaving(false);
    setSaved(true);
  };

  const handleBack = () => {
    setSelectedSlug(null);
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ContentHeader
        hasSelectedPage={!!selectedPage}
        saving={saving}
        saved={saved}
        onSave={handleSave}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!selectedPage && (
          <ContentList
            pages={pages}
            onSelect={handleSelect}
            loading={loading}
          />
        )}

        {selectedPage && (
          <ContentEditor
            page={selectedPage}
            saving={saving}
            saved={saved}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
            onBack={handleBack}
            onSave={handleSave}
            onTogglePublish={handleTogglePublish}
          />
        )}
      </div>
    </div>
  );
}