import { readFileSync, writeFileSync } from 'node:fs';

const appPath = new URL('../src/App.tsx', import.meta.url);
let app = readFileSync(appPath, 'utf8');

if (!app.includes("from './staticData'")) {
  app = app.replace(
    "import brazilSinghAvatar from './assets/images/brazil_singh_avatar_1779533131692.png';",
    `import brazilSinghAvatar from './assets/images/brazil_singh_avatar_1779533131692.png';
import {
  buildStaticCSV,
  createStaticProject,
  getStaticDashboardData,
  mapStaticProject,
  markStaticAlertsRead,
  syncStaticProjects,
  validateStaticProject,
} from './staticData';`,
  );
}

if (!app.includes('const applyDashboardPayload =')) {
  app = app.replace(
    `  const roleOptions: { name: string; email: string; role: any; chapter: string; key: string }[] = [
    { name: "Secure Guest Viewer", email: "guest@youthmappers.org", role: "Guest", chapter: "Independent Observer", key: "rsa_pub_ym_gst_3338ee31fda..." }
  ];
`,
    `  const roleOptions: { name: string; email: string; role: any; chapter: string; key: string }[] = [
    { name: "Secure Guest Viewer", email: "guest@youthmappers.org", role: "Guest", chapter: "Independent Observer", key: "rsa_pub_ym_gst_3338ee31fda..." }
  ];

  const applyDashboardPayload = (payload = getStaticDashboardData()) => {
    setProjects(payload.projects);
    setContributors(payload.contributors);
    setAlerts(payload.alerts);
    setRecentActivities(payload.activities);
    setEncryptionLogs(payload.encryptionLogs);
    setApiEndpoints(payload.apiEndpoints);
  };
`,
  );
}

app = app.replace(
  `      setErrorMessage("Lost connectivity to validation server. Please verify Express server status on Port 3000.");`,
  `      applyDashboardPayload();
      setErrorMessage('');`,
);

app = app.replace(
  `      setSyncError("Lost back-end connection or failed to poll Gemini Search API.");
      setTimeout(() => setSyncError(''), 8000);`,
  `      const data = syncStaticProjects();
      setProjects(data.projects);
      applyDashboardPayload();
      setSyncSuccess(data.message);
      setTimeout(() => setSyncSuccess(''), 6000);`,
);

app = app.replace(
  `    } catch (error) {
      console.error(error);
    }
  };

  // Trigger Mapping simulation POST`,
  `    } catch (error) {
      console.error(error);
      const data = validateStaticProject(projId, count, cipherText, currentUser.email);
      if (data.success) applyDashboardPayload();
    }
  };

  // Trigger Mapping simulation POST`,
);

app = app.replace(
  `    } catch (error) {
      console.error(error);
    }
  };

  // Track Custom Project Addition`,
  `    } catch (error) {
      console.error(error);
      const data = mapStaticProject(projId, count, currentUser.name);
      if (data.success) applyDashboardPayload();
    }
  };

  // Track Custom Project Addition`,
);

app = app.replace(
  `    } catch (err) {
      console.error(err);
    }
  };

  // CSV Report Downloader`,
  `    } catch (err) {
      console.error(err);
      const data = createStaticProject(formData);
      if (data.success) {
        setNewProjectModal(false);
        setFormData({
          title: '',
          projectId: 'HOT #',
          source: 'HOT',
          totalTasks: 350,
          campaign: 'Regional Capacity Build',
          country: 'Rwanda',
          difficulty: 'Medium',
          description: ''
        });
        applyDashboardPayload();
      } else {
        alert(data.message || "Failed to create campaign.");
      }
    }
  };

  // CSV Report Downloader`,
);

app = app.replace(
  `    } catch (err) {
      alert("Failed to export report CSV");
    }
  };

  // Trigger browser print`,
  `    } catch (err) {
      const blob = new Blob([buildStaticCSV(selectedSource)], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`youthmappers-validation-report-\${selectedSource.toLowerCase()}-\${new Date().toISOString().slice(0,10)}.csv\`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setExportModal(false);
    }
  };

  // Trigger browser print`,
);

app = app.replace(
  `    } catch (err) {}
  };
`,
  `    } catch (err) {
      markStaticAlertsRead();
      applyDashboardPayload();
    }
  };
`,
);

writeFileSync(appPath, app);
