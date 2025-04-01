import React, { useEffect } from 'react';
import { ChatSection } from './profile/ChatSection';
import { GoalsSection } from './profile/GoalsSection';
import { NewsSection } from './profile/news/NewsSection';
import { Sidebar } from './profile/Sidebar';
import { ReportView } from './profile/ReportView';
import { Upload } from './profile/Upload';
import { SimulationView } from './simulation/SimulationView';
import { DashboardView } from './dashboard/DashboardView';
import { QuestionnaireForm } from './QuestionnaireForm';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';

export function ProfilePage() {
  const { 
    activeProfile,
    setActiveProfile,
    chatHistory,
    sendMessage,
    goals,
    addGoal,
    removeGoal,
    toggleGoal,
    isLoading
  } = useProfile();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/signin';
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeProfile) {
      case 'dashboard':
        return <DashboardView />;
      case 'report':
        return <ReportView />;
      case 'questionnaire':
        return <QuestionnaireForm />;
      case 'news':
        return <NewsSection fullWidth />;
      case 'simulation':
        return <SimulationView />;
      case 'upload':
        return <Upload />;
      default:
        return (
          <ChatSection
            activeProfile={activeProfile}
            chatHistory={chatHistory}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="h-screen bg-black overflow-hidden">
      <div className="h-full flex gap-8 px-4 lg:px-8">
        <div className="pt-4">
          <Sidebar 
            activeProfile={activeProfile}
            onSelect={setActiveProfile}
            username={user.username}
          />
        </div>

        <div className="flex-1 py-4 pr-64 relative">
          <div className="absolute right-0 top-4 bottom-4 w-56">
            <GoalsSection
              goals={goals}
              onAddGoal={addGoal}
              onRemoveGoal={removeGoal}
              onToggleGoal={toggleGoal}
            />
          </div>
          <div className="h-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}